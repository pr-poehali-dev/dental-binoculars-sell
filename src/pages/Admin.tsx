import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const ADMIN_PASSWORD = 'vavdental2024';
const STATS_URL = 'https://functions.poehali.dev/ef4e5847-3d83-401b-a3d9-076f1f535206';

interface DayStats {
  date: string;
  count: number;
}

interface Stats {
  total: number;
  today: number;
  week: number;
  month: number;
  by_day: DayStats[];
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch(STATS_URL)
      .then(r => r.json())
      .then(data => {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        setStats(parsed);
      })
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, [authed]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center">Админ-панель</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
            />
            {error && <p className="text-destructive text-sm text-center">Неверный пароль</p>}
            <Button className="w-full" onClick={login}>Войти</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const maxCount = stats ? Math.max(...stats.by_day.map(d => d.count), 1) : 1;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Icon name="BarChart2" size={28} className="text-primary" />
          <h1 className="text-3xl font-bold">Статистика визитов</h1>
        </div>

        {loading && <p className="text-muted-foreground">Загрузка...</p>}

        {fetchError && (
          <p className="text-destructive">Не удалось загрузить статистику. Попробуйте обновить страницу.</p>
        )}

        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary">{stats.today}</div>
                  <div className="text-muted-foreground text-sm mt-1">Сегодня</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary">{stats.week}</div>
                  <div className="text-muted-foreground text-sm mt-1">За 7 дней</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary">{stats.month}</div>
                  <div className="text-muted-foreground text-sm mt-1">За 30 дней</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-primary">{stats.total}</div>
                  <div className="text-muted-foreground text-sm mt-1">Всего</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>График за 30 дней</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.by_day.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Данных пока нет</p>
                ) : (
                  <div className="overflow-x-auto pb-2">
                    <div className="flex items-end gap-1 h-48 min-w-max px-1">
                      {stats.by_day.map(day => (
                        <div key={day.date} className="flex flex-col items-center gap-1 w-7 group relative">
                          <div
                            className="w-full bg-primary rounded-t transition-all group-hover:bg-primary/80 flex items-start justify-center pt-1 relative"
                            style={{ height: `${(day.count / maxCount) * 160}px`, minHeight: '4px' }}
                          >
                            <span className="text-[9px] font-medium text-primary-foreground leading-none">
                              {day.count}
                            </span>
                          </div>
                          <span className="text-[9px] text-muted-foreground whitespace-nowrap rotate-45 origin-left mt-1 w-6 block">
                            {day.date.slice(5)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}