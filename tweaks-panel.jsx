function useTweaks(initialValues) {
  const [values, setValues] = React.useState(initialValues || {});

  const setTweak = React.useCallback((key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
  }, []);

  return [values, setTweak];
}

function TweaksPanel() {
  return null;
}

function TweakSection({ children }) {
  return <>{children}</>;
}

function TweakRadio() {
  return null;
}

window.useTweaks = useTweaks;
window.TweaksPanel = TweaksPanel;
window.TweakSection = TweakSection;
window.TweakRadio = TweakRadio;
