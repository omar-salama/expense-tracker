import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/global-exception.filter';
import { ResponseFormatInterceptor } from './common/response-format.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseFormatInterceptor(reflector));
  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Expense Tracker API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http' }, 'Bearer')
    .addSecurityRequirements('Bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, { useGlobalPrefix: true });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
