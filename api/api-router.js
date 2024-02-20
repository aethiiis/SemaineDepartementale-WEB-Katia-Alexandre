import { Router } from "express";
import bodyParser from "body-parser";
import { getUserHome } from "./use-case/get-user-home.js";
import { postBeep } from "./use-case/post-beep.js";
import { getUserPageByName } from "./use-case/get-user-page.js";
import { BeepNotFoundError, like, unlike } from "./use-case/like.js";
import { postResponse } from "./use-case/response.js"
import { follow, unfollow } from "./use-case/follow.js";
import { authMiddleware } from "./auth/auth-middleware.js";

export const api = Router();

api.use(bodyParser.json());

api.use(authMiddleware);

api.get("/me", (req, res) => {
  res.json(req.user);
});

api.get("/home", async (req, res) => {
  const beeps = await getUserHome(req.user.id);

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

api.get("/user/:name", async (req, res) => {
  try {
    const userPage = await getUserPageByName(req.user.id, req.params.name);
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
    const postedResponse = await postResponse(req.user.id, req.params.beepId, req.body.content);
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