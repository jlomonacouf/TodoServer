import { NestFactory } from '@nestjs/core';
import { COOKIE_SECRET } from 'environment';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(session({
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 36000000
    },
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors();
  
  await app.listen(3001);
}
bootstrap();
