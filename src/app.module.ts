import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './typeorm/entities/User';
import { Task } from './typeorm/entities/Task';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TaskStepsModule } from './modules/task-steps/task-steps.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HabitsModule } from './modules/habits/habits.module';
import { HabitOccurencesModule } from './modules/habit-occurences/habit-occurences.module';
import { HabitActionsModule } from './modules/habit-actions/habit-actions.module';
import { TaskStep } from './typeorm/entities/TaskStep';
import { Reminder } from './typeorm/entities/Reminder';
import { Notification } from './typeorm/entities/Notification';
import { Habit } from './typeorm/entities/Habit';
import { HabitOccurence } from './typeorm/entities/HabitOccurence';
import { HabitAction } from './typeorm/entities/HabitAction';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/users/users.auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        entities: [
          User,
          Task,
          TaskStep,
          Reminder,
          Notification,
          Habit,
          HabitOccurence,
          HabitAction,
        ],
        synchronize: true,
      }),
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET_KEY');

        return {
          secret: secret,
          signOptions: {
            expiresIn: '7d',
            issuer: 'habitask',
          },
        };
      },
    }),
    UsersModule,
    TasksModule,
    TaskStepsModule,
    RemindersModule,
    NotificationsModule,
    HabitsModule,
    HabitOccurencesModule,
    HabitActionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
