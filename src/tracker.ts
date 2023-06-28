import { MIXPANEL_TOKEN, MIXPANEL_PROJECT_ID } from './config'

interface MixpanelPayload {
  time?: number
  requestId?: string
  xfp?: string
}

export const config = {
  enable: true,
  origin: '',
  xfp: '',
  mixpanel: {
    token: MIXPANEL_TOKEN,
    projectId: MIXPANEL_PROJECT_ID
  }
}

export function track (event: string, payload: MixpanelPayload): void {
  if (!config.enable) {
    return
  }
  const url = `https://api.mixpanel.com/import?strict=1&project_id=${config.mixpanel.projectId}`
  const xfp = payload.xfp ?? config.xfp
  const time = payload.time ?? Date.now()
  const insertId = typeof payload.requestId === 'string' ? payload.requestId : xfp
  const body = JSON.stringify([
    {
      properties: {
        distinct_id: config.origin,
        time,
        $insert_id: insertId,
        xfp
      },
      event
    }
  ])
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Basic ${config.mixpanel.token}`
    },
    body
  }
  fetch(url, options).catch(console.error)
}
