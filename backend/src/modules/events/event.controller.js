const asyncHandler = require("../../middleware/asyncHandler");
const eventService = require("./event.service");
const { successResponse } = require("../../core/responses");

class EventController {
  create = asyncHandler(async (req, res) => {
    const event = await eventService.createEvent(req.user.id, req.body);
    return successResponse(res, 201, "Event created", event);
  });

  getAll = asyncHandler(async (req, res) => {
    const data = await eventService.getEventsByUser(req.user.id, req.query);
    return successResponse(res, 200, "Events retrieved", data);
  });

  getOne = asyncHandler(async (req, res) => {
    const event = await eventService.getEventById(req.params.id, req.user.id);
    return successResponse(res, 200, "Event retrieved", event);
  });
}

module.exports = new EventController();
