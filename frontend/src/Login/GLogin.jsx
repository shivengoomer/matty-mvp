import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { saveAuthSession } from '../utils/authStorage';
import { useToast } from '../Components/ToastProvider';

export default function GLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pushToast } = useToast();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch(
        (import.meta.env.VITE_API_URL || `https://matty-backend-2.onrender.com`) + "/api/auth/google-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenId: credentialResponse.credential }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        pushToast(data.message || "Google login failed.", "error");
        return;
      }
      const payload = data?.data || data;
      const user = {
        _id: payload._id,
        username: payload.username,
        role: payload.role,
        token: payload.token,
      };
      saveAuthSession({
        token: payload.token,
        refreshToken: payload.refreshToken,
        user,
      });
      dispatch(setUser(user));
      pushToast("Google login successful", "success");
      navigate('/dashboard');
    } catch (error) {
      pushToast("Google login failed due to network or server error.", "error");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={() => pushToast('Google login failed', "error")}
    />
  );
}
