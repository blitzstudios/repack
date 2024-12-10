Release flow:

1) Push changes to new release branch.
2) Update package.json version.
3) `pnpm install` from root directory.
4) `pnpm build` from root directory.
5) `cd packages/repack`
7) run `gitpkg publish`
