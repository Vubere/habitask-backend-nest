import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SyncService {
  constructor(private readonly dataSource: DataSource) {}

  async getChanges(userId: string, since?: string) {
    const params: (string | number)[] = [userId];
    let habitSql = 'SELECT * FROM habits WHERE user_id = ?';
    let taskSql = 'SELECT * FROM tasks WHERE user_id = ?';
    let completionSql = 'SELECT * FROM habit_completions WHERE user_id = ?';
    if (since) {
      habitSql += ' AND updated_at >= ?';
      taskSql += ' AND updated_at >= ?';
      completionSql += ' AND updated_at >= ?';
      params.push(since);
    }
    const habits = await this.dataSource.query(habitSql, params);
    const tasks = await this.dataSource.query(taskSql, params);
    const habit_completions = await this.dataSource.query(completionSql, params);
    return {
      habits,
      tasks,
      habit_completions,
      server_time: new Date().toISOString(),
    };
  }
}
