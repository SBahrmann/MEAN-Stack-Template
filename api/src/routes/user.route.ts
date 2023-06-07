import { IUser, UserModel } from "../models/user.model";
import { Request, Response, Router } from "express";

export class UserRoute {

  public router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes(): void {
    this.router.get("/", this.getUsers);
    this.router.get("/:id", this.getUserById);
    this.router.post("/", this.createUser);
    this.router.put("/:id", this.updateUser);
    this.router.delete("/:id", this.deleteUser);
  }

  private getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      let users: IUser[] = await UserModel.find({ deleted: { $ne: true } });
      users = users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        theme: user.theme,
      }));

      res.status(200).json(users);
    } catch (error) {
      res.status(500).send('Error: ' + error);
    }
  };

  private getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const user: IUser | null = await UserModel.findById(req.params.id);
      if (!user) {
        res.status(404).send();
        return;
      }
      const resUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        theme: user.theme,
      };
      res.status(200).json(resUser);
    } catch (error) {
      res.status(500).send('Error: ' + error);
    }
  };

  private createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      delete req.body._id;
      const user: IUser = await UserModel.create(req.body);
      const resUser: IUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        theme: user.theme,
      };
      res.status(200).json(resUser);
    } catch (error) {
      res.status(500).send('Error: ' + error);
    }
  }

  private updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const updatedUser = req.body;

      if (updatedUser.password) {
        updatedUser.password = updatedUser.password;
      } else {
        delete updatedUser.password;
      }

      const user = await UserModel.findByIdAndUpdate(userId, updatedUser, { new: true });

      if (!user) {
        res.status(404).send();
        return;
      }

      const resUser: IUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        theme: user.theme,
      };
      res.status(200).json(resUser);

    } catch (error: any) {
      if (error.codeName === 'DuplicateKey') {
        res.status(500).send('Error: E-Mail Address exists');
      } else {
        console.log(error);
        res.status(500).send('Error: ' + error);
      }
    }
  }

  private deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await UserModel.findByIdAndDelete(req.params.id);
      if (!user) {
        res.status(404).send();
      } else {
        const resUser: IUser = {
          _id: user._id,
          name: user.name,
          email: user.email,
          theme: user.theme,
        };
        res.status(200).json(resUser);
      }
    } catch (error) {
      res.status(500).send('Error: ' + error);
    }
  }
}

export default new UserRoute();
