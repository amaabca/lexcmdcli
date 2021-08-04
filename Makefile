.PHONY: build list

export APP_ENVIRONMENT ?= production
export ALIAS ?= prod
export AWS_PROFILE ?= redteam-$(APP_ENVIRONMENT)-sso


BOT_ID ?=


build:
	@AWS_PROFILE=$(AWS_PROFILE) bin/run build -b $(BOT_ID) -a $(ALIAS)

list:
	@AWS_PROFILE=$(AWS_PROFILE) bin/run list
