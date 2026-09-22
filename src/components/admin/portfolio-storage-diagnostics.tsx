import type { PortfolioStorageDiagnostics } from '@/lib/storage/blob-diagnostics';

type PortfolioStorageDiagnosticsProps = {
  diagnostics: PortfolioStorageDiagnostics;
  recentProjectPaths?: string[];
};

function formatBool(value: boolean): string {
  return value ? 'ano' : 'ne';
}

export default function PortfolioStorageDiagnostics({
  diagnostics,
  recentProjectPaths = [],
}: PortfolioStorageDiagnosticsProps) {
  return (
    <details className="admin-diagnostics">
      <summary className="admin-diagnostics__summary">
        Diagnostika úložiště (Blob)
      </summary>

      <dl className="admin-diagnostics__list">
        <div>
          <dt>Prostředí</dt>
          <dd>
            {diagnostics.runtime}
            {diagnostics.vercelEnv ? ` (${diagnostics.vercelEnv})` : ''}
          </dd>
        </div>
        <div>
          <dt>Režim uploadu</dt>
          <dd>{diagnostics.storageMode}</dd>
        </div>
        <div>
          <dt>BLOB_READ_WRITE_TOKEN</dt>
          <dd>{formatBool(diagnostics.blobTokenConfigured)}</dd>
        </div>
        <div>
          <dt>BLOB_STORE_ID</dt>
          <dd>{formatBool(diagnostics.blobStoreIdConfigured)}</dd>
        </div>
        <div>
          <dt>Veřejná URL</dt>
          <dd>{diagnostics.blobPublicBaseUrl ?? '—'}</dd>
        </div>
        <div>
          <dt>Prefix ve store</dt>
          <dd>{diagnostics.blobStorePrefix}</dd>
        </div>
        <div>
          <dt>Souborů v Blob (portfolio)</dt>
          <dd>
            {diagnostics.blobFileCount === null
              ? '—'
              : String(diagnostics.blobFileCount)}
          </dd>
        </div>
      </dl>

      {diagnostics.testImageUrl ? (
        <p className="admin-diagnostics__test-url">
          Test URL:{' '}
          <a
            href={diagnostics.testImageUrl}
            target="_blank"
            rel="noreferrer"
            className="admin-diagnostics__link"
          >
            {diagnostics.testImageUrl}
          </a>
        </p>
      ) : null}

      {diagnostics.blobListSample.length > 0 ? (
        <div className="admin-diagnostics__paths">
          <p className="admin-diagnostics__label">Ukázka z Blob list():</p>
          <ul>
            {diagnostics.blobListSample.map((storedPath) => (
              <li key={storedPath}>
                <code>{storedPath}</code>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {recentProjectPaths.length > 0 ? (
        <div className="admin-diagnostics__paths">
          <p className="admin-diagnostics__label">Cesty v DB (poslední projekty):</p>
          <ul>
            {recentProjectPaths.map((storedPath) => (
              <li key={storedPath}>
                <code>{storedPath}</code>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {diagnostics.notes.length > 0 ? (
        <ul className="admin-diagnostics__notes">
          {diagnostics.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      ) : null}
    </details>
  );
}
