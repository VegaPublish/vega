export default function resolveInviteLink(venueName, inviteId) {
  return `${document.location.protocol}//${
    document.location.host
  }/invites/${venueName}/${inviteId}`
}
