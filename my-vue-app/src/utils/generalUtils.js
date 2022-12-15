const wrapDevOnlyConsoleLog = () => {
  const debug = console.log;
  console.log = (...args) => {
    if (import.meta.env.DEV) debug(...args);
  };
};

const $ = document.getElementById.bind(document);

export { wrapDevOnlyConsoleLog, $ };
