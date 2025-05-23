create table Property (
  id  character varying(255),
  key character varying(255) UNIQUE,
  value character varying(255),
  port integer,
  enabled boolean
);