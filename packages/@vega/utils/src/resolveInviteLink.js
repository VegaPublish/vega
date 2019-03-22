export default function resolveInviteLink(datasetName, inviteId) {
  return `${document.location.protocol}//${
    document.location.host
  }/invites/${datasetName}/${inviteId}`
}
