import React from "react";
import styles from "./ProviderSelector.module.css";

export function ProviderSelector({ providers, selectedProvider, onChange }) {
  return (
    <div className={styles.ProviderSelector}>
      {providers.map((prov) => (
        <div
          key={prov.id}
          className={`${styles.ProviderCard} ${styles[prov.id]} ${
            selectedProvider === prov.id ? styles.Active : ""
          }`}
          onClick={() => onChange(prov.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onChange(prov.id);
            }
          }}
        >
          <img
            src={prov.logo}
            alt={prov.name}
            className={styles.ProviderLogo}
            width={24}
            height={24}
          />
          <span className={styles.ProviderName}>{prov.name}</span>
        </div>
      ))}
    </div>
  );
}
