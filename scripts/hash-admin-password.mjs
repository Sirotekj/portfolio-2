console.error(
  'admin:hash-password je zastaralé. Použij:\n' +
    '  npm run admin:generate-secret\n' +
    '  npm run admin:create-user -- email@example.com heslo',
);
process.exit(1);
