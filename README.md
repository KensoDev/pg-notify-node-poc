# Testing the postgres notification system

## Setting up

In order to set up, make sure you initiate a new database first

```
initdb -D pgdata
createdb testing
psql -d testing

DROP TABLE safari_events;
CREATE TABLE public.safari_events(
  id UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP NULL,
  payload JSONB NULL,
  CONSTRAINT events_pkey PRIMARY KEY(id),
  CONSTRAINT events_ukey UNIQUE(id)
);

CREATE OR REPLACE FUNCTION public.notify_safari_events()
 RETURNS TRIGGER
 LANGUAGE PLPGSQL
AS $tg_notify_events$
DECLARE
    --channel TEXT := TG_ARGV[0];
BEGIN
    PERFORM pg_notify('safari_events', row_to_json(NEW)::text);
    RETURN NEW;
END;
$tg_notify_events$;

CREATE INDEX ON safari_events(id);
CREATE INDEX ON safari_events(sent_at);

CREATE OR REPLACE TRIGGER notify_safari_events
    AFTER INSERT ON public.safari_events
    FOR EACH ROW EXECUTE PROCEDURE public.notify_safari_events();

CREATE USER testing WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE testing TO testing;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public to testing;
```
