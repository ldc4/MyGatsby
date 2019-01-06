import Typography from 'typography'
import GithubTheme from 'typography-theme-github'
import CodePlugin from 'typography-plugin-code'

GithubTheme.plugins = [
  new CodePlugin(),
]

const typography = new Typography(GithubTheme);

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export default typography;
