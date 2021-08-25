/* istanbul ignore next */
(() => {
  /* eslint-disable @typescript-eslint/explicit-function-return-type */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  /* eslint-disable no-func-assign */
  /* eslint-disable no-undef */
  const styles = [
    `background: #2ecc71`,
    `border-radius: 0.5em`,
    `color: white`,
    `font-weight: bold`,
    `padding: 2px 0.5em`,
  ];
  const logPrefix = ['%cpaint', styles.join(';')];
  console.log = console.log.bind(console, ...logPrefix);
  console.groupCollapsed = console.groupCollapsed.bind(console, ...logPrefix);
})();
