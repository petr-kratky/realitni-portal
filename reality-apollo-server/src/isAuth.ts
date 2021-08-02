import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { MyContext } from "./MyContext";

// bearer 102930ajslkdaoq01

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  // console.log('context.req.originalUrl', context.req.body.operationName)
  // return next();
  if(context.req.body.operationName === 'Login' || context.req.body.operationName === 'Register'){ //je to bezpecnostni riziko ???
    return next();
  }

  if ((!authorization)){
    throw new Error("authorization header missing");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    console.log('authorization', authorization, payload)
    context.payload = payload as any;
  } catch (err) {
    console.log(err);
    throw new Error("not authenticated - token invalid");
  }

  return next();
};
