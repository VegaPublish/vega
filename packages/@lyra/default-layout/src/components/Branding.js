import React from 'react'
import styles from 'part:@lyra/default-layout/branding-style'
import LyraLogo from 'part:@lyra/base/lyra-logo'
import BrandLogo from 'part:@lyra/base/brand-logo?'
import {StateLink} from 'part:@lyra/base/router'
import config from 'config:lyra'

function Branding() {
  const projectName = (config.project && config.project.name) || ''
  return (
    <div className={styles.root}>
      <StateLink toIndex className={styles.link} title={projectName}>
        {BrandLogo && (
          <div className={styles.brandLogoContainer}>
            <BrandLogo projectName={projectName} />
          </div>
        )}
        {!BrandLogo && (
          <div>
            <div className={styles.brandLogoContainer}>
              <LyraLogo projectName={projectName} />
            </div>
            <h1 className={styles.projectName}>{projectName}</h1>
          </div>
        )}
      </StateLink>
    </div>
  )
}

export default Branding
