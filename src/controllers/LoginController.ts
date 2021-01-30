import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { decorator } from '../decorators/routesDecorators';
import { classController } from '../decorators/classDecorators';
import { User } from '../models/userModel';
import { signinChain, signupChain } from '../validation/validationChain';
import { requestValidation } from '../validation/validationMiddleware';

@classController('/api/users')
class LoginController {
  @decorator.get('/currentuser')
  getCurrentUser(req: Request, res: Response): void {
    res.json('Hi there currentuser!!');
  }

  @decorator.post('/signin')
  @decorator.use(signinChain)
  @decorator.use(requestValidation)
  signinUser(req: Request, res: Response): void {
    res.json('Post request to signinUser is worked !');
  }

  // @post('/api/users/signout')
  signoutUser(req: Request, res: Response): void {}

  @decorator.post('/signup')
  @decorator.use(signupChain)
  @decorator.use(requestValidation)
  async signupUser(req: Request, res: Response) {
    const { email, password } = req.body;

    // find user email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('Email in use');
      return res.send({});
    }

    // save user to mongo
    const user = User.build({ email, password });
    await user.save();

    // create JsonWebToken
    if (process.env.JWT_KEY) {
      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_KEY
      );

      // save JsonWebToken in session object
      req.session = {
        jwt: userJwt,
      };
    }

    res.status(201).send(user);
  }
}
