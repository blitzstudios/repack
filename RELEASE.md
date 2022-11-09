Release flow:

1) Push changes to new release branch.
2) Update package.json version.
3) `yarn install` from root directory.
4) cd to packages/repack
5) `yarn build`
6) run `gitpkg publish`
