const Event = require('../../../Models/Event');
const { createError } = require("../../utils/api");

class EventService {
  async createEvent(userId, data) {
    const { title, description, date, location, workspaceId } = data;
    
    // In a mature app, check workspaceId authorization here
    
    const event = new Event({
      title,
      description,
      date,
      location,
      workspace: workspaceId,
      organizer: userId,
      participants: [{ user: userId, status: 'accepted' }] // Organizer auto-accepts
    });

    await event.save();
    return event;
  }

  async getEventsByUser(userId, queryParams) {
    const { page = 1, limit = 10, search, status } = queryParams;
    const skip = (page - 1) * limit;

    const query = { 'participants.user': userId };

    if (search) {
      query.$text = { $search: search };
    }

    if (status) { // Filter by relation status (invited, accepted, etc.)
      query.participants = { $elemMatch: { user: userId, status } };
    }

    const events = await Event.find(query)
      .populate('organizer', 'username email')
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ date: 1 });

    const total = await Event.countDocuments(query);

    return {
      events,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getEventById(eventId, userId) {
    const event = await Event.findById(eventId)
      .populate('organizer', 'username email')
      .populate('participants.user', 'username email');

    if (!event) throw createError(404, "Event not found");

    // Check if the user is a participant
    const isParticipant = event.participants.some(p => p.user._id.toString() === userId.toString());
    
    // In real app, we might also check if the event belongs to an open workspace 
    if (!isParticipant && event.organizer._id.toString() !== userId.toString()) {
      throw createError(403, "Access denied");
    }

    return event;
  }
}

module.exports = new EventService();
