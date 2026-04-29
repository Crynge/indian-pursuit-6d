# Unity Blueprint

The `unity-blueprint/` folder exists to make the repo useful beyond the browser prototype.

## Design intent

Mirror the browser systems using C# scripts and Unity-friendly responsibilities:

- scene bootstrap
- road streaming
- player handling
- traffic pooling
- police pursuit pressure
- shared race state

## Why blueprint instead of fake binary

Unity is not installed in this environment. Shipping a pretend Unity build would be misleading, so this repo includes an honest, structured blueprint instead:

- portable C# system skeletons
- a clear folder layout
- system-level documentation

## Suggested next real Unity steps

1. Create a new Unity 6 URP or HDRP project.
2. Copy the `unity-blueprint/Assets/Scripts` content into `Assets/Scripts`.
3. Replace primitive placeholder vehicles with modeled prefabs.
4. Map browser gameplay constants into ScriptableObjects.
5. Build lighting, reflection probes, terrain dressing, and VFX in-engine.

