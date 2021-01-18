import 'reflect-metadata';
import { myRouter } from '../myRouter';

const router = myRouter.getRouter;

const classController = (routePrefix: string) => {
  return (thisObject: Function) => {
    for (let key in thisObject.prototype) {
      const method = thisObject.prototype[key];

      const route = Reflect.getMetadata('route', thisObject.prototype, key);

      if (route) {
        router.get(`${routePrefix}${route}`, method);
      }
    }
  };
};

export { classController, router };