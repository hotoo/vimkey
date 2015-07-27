version = $(shell cat package.json | grep version | awk -F'"' '{print $$4}')

test:
	@npm test

publish-doc:
	@spm doc publish

publish: publish-doc
	@npm publish
	@spm publish
	@git tag $(version)
	@git push origin $(version)

.PHONY: test publish coverage install
