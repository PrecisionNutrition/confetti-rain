# confetti-rain

Yet another confetti package! This one is based upon
Santiageo Ferreira's excellent [ember-confetti](https://github.com/san650/ember-confetti)
package, but has been stripped of all Ember. This makes it ideal
for reuse in other framework specific code.

## Example usage

```javascript
import confettiRain from "confetti-rain";
confettiRain.start();
```

## Limitations

1. Assumes browser environment
2. Assumes RAF support in said browser
