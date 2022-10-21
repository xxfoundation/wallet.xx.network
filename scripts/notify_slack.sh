#!/bin/bash

set -euo pipefail

FAILURE=1
SUCCESS=0

function displaytime {
  local T=$1
  local D=$((T/60/60/24))
  local H=$((T/60/60%24))
  local M=$((T/60%60))
  local S=$((T%60))
  (( $D > 0 )) && printf '%d days ' $D
  (( $H > 0 )) && printf '%d hours ' $H
  (( $M > 0 )) && printf '%d minutes ' $M
  (( $D > 0 || $H > 0 || $M > 0 )) && printf 'and '
  printf '%d seconds\n' $S
}

function print_slack_summary() {
    local slack_msg_header
    local slack_msg_body
    local channel

    # Populate header and define slack channels

    # Create slack message body
    git=$(sh /etc/profile; which git)
    number_of_commits=$("$git" rev-list HEAD --count)
    latest_tag=$(git describe --tags --abbrev=0)
    commits_diff=$(printf '%b\n' "$(git log --max-count=20 --pretty="%h - %s (%an)" $latest_tag..HEAD)")
    slack_msg_header=":x: Deploying ${latest_tag} to ${CI_ENVIRONMENT_SLUG} failed"

    if [[ "${EXIT_STATUS}" == "${SUCCESS}" ]]; then
        slack_msg_header=":white_check_mark: Deploying ${latest_tag} to ${CI_ENVIRONMENT_SLUG} succeeded"
    fi

    channel="$SLACK_CHANNEL"

    build_time=$(displaytime $(($BUILD_END-$BUILD_START)))

    read -r -d '' slack_msg_body << EOM
    Deployed to: $CI_ENVIRONMENT_URL.
Build Time: $build_time
$commits_diff"
EOM

    jq -nc --arg slack_msg_header "$slack_msg_header"  --arg slack_msg_body "$slack_msg_body" --arg channel "$channel" << BODY '{
        "channel": $channel,
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": $slack_msg_header
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": $slack_msg_body
            }
          }
        ]
      }'


BODY
}

function share_slack_update() {

	local slack_webhook

    slack_webhook="$SLACK_WEBHOOK"


    curl -X POST                                           \
        --data-urlencode "payload=$(print_slack_summary)"  \
        "${slack_webhook}"
}

share_slack_update
