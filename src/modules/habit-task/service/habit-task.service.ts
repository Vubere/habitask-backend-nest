import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HabitTaskQuery, HabitTaskType } from '../types';
import { PaginationAndSort } from '../../general/types';
import { getOffset } from '../../../utils/helpers';

@Injectable()
export class HabitTaskService {
  constructor(private readonly dataSource: DataSource) {}

  async getHabitTaskDisplayDetails(
    filter: HabitTaskQuery,
    pagination: PaginationAndSort,
    search?: string,
  ): Promise<HabitTaskType[]> {
    const rows: HabitTaskType[] = [];

    if (!filter.type || filter.type === 'habit') {
      const habits = await this.fetchHabits(filter, search);
      const progressMap = await this.todayProgressByHabit(
        habits.map((h: any) => h.id),
      );
      const streakMap = await this.streaksByHabit(habits);
      for (const h of habits) {
        rows.push({
          id: h.id,
          type: 'habit',
          title: h.title,
          notes: h.notes,
          icon: h.icon,
          color: h.color,
          status: '',
          progress: progressMap[h.id] ?? 0,
          target: Number(h.target) || 1,
          streak: streakMap[h.id] ?? 0,
          created_at: h.created_at,
          updated_at: h.updated_at,
        });
      }
    }

    if (!filter.type || filter.type === 'task') {
      const tasks = await this.fetchTasks(filter, search);
      for (const t of tasks) {
        const subtasks = this.parseSubtasks(t.subtasks);
        rows.push({
          id: t.id,
          type: 'task',
          title: t.title,
          notes: t.notes,
          icon: t.icon,
          color: t.color,
          status: t.status,
          progress: subtasks.filter((s) => s.done).length,
          target: subtasks.length,
          streak: null,
          created_at: t.created_at,
          updated_at: t.updated_at,
        });
      }
    }

    rows.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    const offset = getOffset(pagination.page, pagination.per_page);
    return rows.slice(offset, offset + pagination.per_page);
  }

  private async fetchHabits(filter: HabitTaskQuery, search?: string) {
    let sql = `SELECT id, title, notes, icon, color, target_per_day as target, start_date, created_at, updated_at
      FROM habits WHERE user_id = ? AND archived_at IS NULL`;
    const params: any[] = [filter.user_id];
    if (filter.created_at_gte) {
      sql += ' AND created_at >= ?';
      params.push(filter.created_at_gte);
    }
    if (filter.created_at_lte) {
      sql += ' AND created_at <= ?';
      params.push(filter.created_at_lte);
    }
    if (search) {
      sql += ' AND (title LIKE ? OR notes LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    return this.dataSource.query(sql, params);
  }

  private async fetchTasks(filter: HabitTaskQuery, search?: string) {
    let sql = `SELECT id, title, notes, icon, color, status, subtasks, created_at, updated_at
      FROM tasks WHERE user_id = ? AND archived_at IS NULL`;
    const params: any[] = [filter.user_id];
    if (filter.created_at_gte) {
      sql += ' AND created_at >= ?';
      params.push(filter.created_at_gte);
    }
    if (filter.created_at_lte) {
      sql += ' AND created_at <= ?';
      params.push(filter.created_at_lte);
    }
    if (search) {
      sql += ' AND (title LIKE ? OR notes LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    return this.dataSource.query(sql, params);
  }

  private async todayProgressByHabit(ids: string[]): Promise<Record<string, number>> {
    if (!ids.length) return {};
    const placeholders = ids.map(() => '?').join(',');
    const day = new Date().toISOString().slice(0, 10);
    const agg = await this.dataSource.query(
      `SELECT habit_id, SUM(count) as total FROM habit_completions
       WHERE date = ? AND habit_id IN (${placeholders}) GROUP BY habit_id`,
      [day, ...ids],
    );
    const map: Record<string, number> = {};
    for (const row of agg) {
      map[row.habit_id] = Number(row.total) || 0;
    }
    return map;
  }

  private async streaksByHabit(habits: any[]): Promise<Record<string, number>> {
    const streaks: Record<string, number> = {};
    if (!habits.length) return streaks;
    const ids = habits.map((h) => h.id);
    const placeholders = ids.map(() => '?').join(',');
    const rows = await this.dataSource.query(
      `SELECT habit_id, date, SUM(count) as total FROM habit_completions
       WHERE habit_id IN (${placeholders}) GROUP BY habit_id, date`,
      ids,
    );
    const perHabit: Record<string, Record<string, number>> = {};
    for (const row of rows) {
      const day = String(row.date).slice(0, 10);
      perHabit[row.habit_id] = perHabit[row.habit_id] || {};
      perHabit[row.habit_id][day] = Number(row.total) || 0;
    }
    const today = this.dayOnly(new Date());
    for (const h of habits) {
      const target = Number(h.target) || 1;
      const counts = perHabit[h.id] || {};
      const isComplete = (d: Date) => (counts[this.dateKey(d)] || 0) >= target;
      const start = h.start_date ? this.dayOnly(new Date(h.start_date)) : today;
      let day = today;
      if (!isComplete(day)) {
        day = this.addDays(day, -1);
      }
      let current = 0;
      while (day.getTime() >= start.getTime() && isComplete(day)) {
        current++;
        day = this.addDays(day, -1);
      }
      streaks[h.id] = current;
    }
    return streaks;
  }

  private dayOnly(d: Date): Date {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }

  private dateKey(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  private addDays(d: Date, days: number): Date {
    const copy = new Date(d);
    copy.setUTCDate(copy.getUTCDate() + days);
    return copy;
  }

  private parseSubtasks(raw: any): { done: boolean }[] {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

