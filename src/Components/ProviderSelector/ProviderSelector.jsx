import React from "react";
import styles from "./ProviderSelector.module.css";

// Component to display a list of selectable AI providers
export function ProviderSelector({ providers, selectedProvider, onChange }) {
  return (
    // Container for the provider selection UI
    <div className={styles.ProviderSelector}>
      {/* Map through each provider and render as a selectable card */}
      {providers.map((prov) => (
        <div
          key={prov.id} // Unique key for React list rendering
          className={`${styles.ProviderCard} ${styles[prov.id]} ${
            selectedProvider === prov.id ? styles.Active : "" // Highlight if currently selected
          }`}
          onClick={() => onChange(prov.id)} // Handle mouse click
          role="button" // Accessibility: marks div as a button
          tabIndex={0} // Allows keyboard focus
          onKeyDown={(e) => {
            // Allow Enter or Space key to select the provider
            if (e.key === "Enter" || e.key === " ") {
              onChange(prov.id);
            }
          }}
        >
          {/* Provider logo (e.g., GPT, Claude, etc.) */}
          <img
            src={prov.logo} // Image source for the provider logo
            alt={prov.name} // Alt text for accessibility
            className={styles.ProviderLogo}
            width={24}
            height={24}
          />

          {/* Provider name displayed beside the logo */}
          <span className={styles.ProviderName}>{prov.name}</span>
        </div>
      ))}
    </div>
  );
}
