import { Router } from "express";
import bodyParser from "body-parser";
import { getUserHome } from "./use-case/get-user-home.js";
import { postBeep } from "./use-case/post-beep.js";
import { getUserPageByName } from "./use-case/get-user-page.js";
import { BeepNotFoundError, like, likeResponse, unlike, unlikeResponse } from "./use-case/like.js";
import { postResponse } from "./use-case/response.js"
import { follow, unfollow } from "./use-case/follow.js";
import { authMiddleware } from "./auth/auth-middleware.js";
import { getResponses } from "./use-case/get-responses.js";
import { getNbBeepsHome } from "./use-case/get-nb-beeps-home.js";

export const api = Router();

api.use(bodyParser.json());

api.use(authMiddleware);

api.get("/me", (req, res) => {
  res.json(req.user);
});

api.get("/home/:Nb", async (req, res) => {
  const beeps = await getUserHome(req.user.id, req.params.Nb);

  res.json(beeps);
});

api.post("/beep", async (req, res) => {
  try {
    const postedBeep = await postBeep(req.user, req.body.content);
    res.status(201).json(postedBeep);
  } catch (e) {
    if (e instanceof BeepTooLongError) {
      res.status(400).send("Beep too long");
    } else {
      throw e;
    }
  }
});

api.get("/user/:name/:Nb", async (req, res) => {
  try {
    const userPage = await getUserPageByName(req.user.id, req.params.name, req.params.Nb);
    res.status(200).json(userPage);
  } catch (e) {
    if (e instanceof UsernameNotFound) {
      res.status(400).send("User not found");
    } else {
      throw e;
    }
  }
});

api.put("/follow/:userId", async (req, res) => {
  try {
    await follow(req.user.id, req.params.userId);
    res.status(200).send();
  } catch (e) {
    if (e instanceof FolloweeDoesNotExistError) {
      res.status(400).send("User not found");
    } else {
      throw e;
    }
  }
});

api.put("/unfollow/:userId", async (req, res) => {
  try {
    await unfollow(req.user.id, req.params.userId);
    res.status(200).send();
  } catch (e) {
    if (e instanceof FolloweeDoesNotExistError) {
      res.status(400).send("User not found");
    } else {
      throw e;
    }
  }
});

api.put("/like/:beepId", async (req, res) => {
  try {
    await like(req.user.id, req.params.beepId);
    res.status(200).send();
  } catch (e) {
    if (e instanceof BeepNotFoundError) {
      res.status(400).send("Beep not found");
    } else {
      throw e;
    }
  }
});

api.put("/unlike/:beepId", async (req, res) => {
  try {
    await unlike(req.user.id, req.params.beepId);
    res.status(200).send();
  } catch (e) {
    if (e instanceof BeepNotFoundError) {
      res.status(400).send("Beep not found");
    } else {
      throw e;
    }
  }
});

api.post("/response/:beepId", async (req, res) => {
  try  {
    const postedResponse = await postResponse(req.user, req.params.beepId, req.body.content);
    res.status(201).json(postedResponse);
  } catch (e) {
    if (e instanceof BeepNotFoundError) {
      res.status(400).send("Beep not found");
    } if (e instanceof BeepTooLongError) {
      res.status(400).send("Response too long");
    } else {
      throw e;
    }
  }
})

api.get("/beepResponses/:beepId/:Nb", async (req, res) => {
  const responses = await getResponses(req.params.beepId, req.user.id, req.params.Nb);

  res.json(responses);
});

api.get("/NbBeepsHome", async (req, res) => {
  const beeps = await getNbBeepsHome(req.user.id, req.params.Nb);

  res.json(beeps);
});

api.put("/likeResponse/:responseId", async (req, res) => {
  try {
    await likeResponse(req.user.id, req.params.responseId);
    res.status(200).send();
  } catch (e) {
    if (e instanceof BeepNotFoundError) {
      res.status(400).send("Response not found");
    } else {
      throw e;
    }
  }
});

api.put("/unlikeResponse/:responseId", async (req, res) => {
  try {
    await unlikeResponse(req.user.id, req.params.responseId);
    res.status(200).send();
  } catch (e) {
    if (e instanceof BeepNotFoundError) {
      res.status(400).send("Response not found");
    } else {
      throw e;
    }
  }
});