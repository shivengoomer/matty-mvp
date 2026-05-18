const Workspace = require('../../../Models/Workspace');
const ActivityLog = require('../../../Models/ActivityLog');
const { createError } = require("../../utils/api");

class WorkspaceService {
  async createWorkspace(userId, data) {
    const { name, isPublic } = data;
    
    const workspace = new Workspace({
      name,
      owner: userId,
      members: [{ user: userId, role: 'owner' }],
      settings: { isPublic: isPublic || false }
    });

    await workspace.save();

    await ActivityLog.create({
      workspace: workspace._id,
      user: userId,
      action: 'created_workspace',
      details: { name }
    });

    return workspace;
  }

  async getWorkspacesByUser(userId) {
    return await Workspace.find({ 'members.user': userId }).populate('owner', 'username email');
  }

  async getWorkspaceById(workspaceId, userId) {
    const workspace = await Workspace.findById(workspaceId)
      .populate('members.user', 'username email role')
      .populate('owner', 'username email');

    if (!workspace) throw createError(404, "Workspace not found");

    const isMember = workspace.members.some(member => member.user._id.toString() === userId.toString());
    if (!isMember && !workspace.settings.isPublic) {
      throw createError(403, "Access denied to this workspace");
    }

    return workspace;
  }

  async inviteUser(workspaceId, adminUserId, targetUserEmail, role) {
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) throw createError(404, "Workspace not found");

    const isAdmin = workspace.members.some(
      m => m.user.toString() === adminUserId.toString() && ['owner', 'editor'].includes(m.role)
    );
    if (!isAdmin) throw createError(403, "Insufficient permissions to invite users");

    // In a real app we'd look up the user by email, or create a pending invite
    // For now we'll just throw a placeholder error if user mapping isn't implemented here fully
    throw createError(501, "Inviting by email needs full user lookup implementation.");
  }
}

module.exports = new WorkspaceService();
