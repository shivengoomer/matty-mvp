const asyncHandler = require("../../middleware/asyncHandler");
const workspaceService = require("./workspace.service");
const { successResponse } = require("../../core/responses");

class WorkspaceController {
  create = asyncHandler(async (req, res) => {
    const workspace = await workspaceService.createWorkspace(req.user.id, req.body);
    return successResponse(res, 201, "Workspace created", workspace);
  });

  getAll = asyncHandler(async (req, res) => {
    const workspaces = await workspaceService.getWorkspacesByUser(req.user.id);
    return successResponse(res, 200, "Workspaces retrieved", workspaces);
  });

  getOne = asyncHandler(async (req, res) => {
    const workspace = await workspaceService.getWorkspaceById(req.params.id, req.user.id);
    return successResponse(res, 200, "Workspace retrieved", workspace);
  });
}

module.exports = new WorkspaceController();
