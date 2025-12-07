import { Router, Request, Response } from "express";
import { chatcontroller, msgcontroller } from "../../Di/Chat/ChatInjection";

export class ChatRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.setRoutes();
  }

  private setRoutes(): void {

    this.router.post("/find-or-create", (req: Request, res: Response) => {
      chatcontroller.findOrCreateChat(req, res);
    });
    this.router.get("/messages/:chatId", (req: Request, res: Response) => {
      msgcontroller.getMessagesByChatId(req, res);
    });

    this.router.get("/:userId", (req: Request, res: Response) => {
      chatcontroller.getChatsOfUser(req, res);
    });

    // this.router.post("/enable-chat", (req: Request, res: Response) => {
    //   chatcontroller.enableChat(req, res);
    // });


  }
}
