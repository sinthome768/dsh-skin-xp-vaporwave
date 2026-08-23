# dsh-skin-xp-vaporwave

[简体中文](README.zh.md)

A standalone distribution of the **XP Vaporwave** skin for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web GUI — a Windows XP chrome layer over a neon vaporwave city, with a pointer-transparent "flying-over-the-city" canvas backdrop.

The skin registers into the harness's `ui-theme` skin registry (skin id **`xp-vaporwave`**), so it appears in the same theme picker as the built-in light/dark skins and every other registered skin.

## Preview

![XP Vaporwave skin](preview.png)

## Install

> Requires a DSH **web profile** (the standard web deployment). The harness already
> provides the `ui-theme` and `locale` services this skin needs; installing this
> package only adds the skin module.

Install from GitHub (default branch):

```sh
dsh plugin --profile web add github:sinthome768/dsh-skin-xp-vaporwave
```

For reproducibility, pin to a full 40-character commit SHA (the skin center /
marketplace model):

```sh
dsh plugin --profile web add github:sinthome768/dsh-skin-xp-vaporwave#<full-commit-sha>
```

Then restart the DSH Web server so the new bundle is loaded.

## Use

Open **Settings → General → Appearance / Skin** and select **XP Vaporwave**, or set it
directly in the profile configuration:

```yaml
ui-theme:
  skin: xp-vaporwave
  preference: dark
```

The skin is an attribute-gated (`body[data-ds-skin="xp-vaporwave"]`) global
stylesheet; it is inert until selected and unloads cleanly when the theme
returns to the built-in default.

## Compatibility

- Target surface: DeepSeek Harness Web client.
- Declared as `dsh.client.platform: web` (browser-only; the node half is an
  empty `apply`).
- The client bundle is self-contained (no runtime module-table requests beyond
  the shell baseline) and ships as the `./client` export.

## License

MIT. See [LICENSE](LICENSE). Source of record:
`deepseek-ai/deepseek-harness` (`packages/client/ui-skin-xp-vaporwave`).
