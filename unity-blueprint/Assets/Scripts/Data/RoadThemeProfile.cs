using UnityEngine;

namespace NH6Pursuit.Data
{
    [CreateAssetMenu(menuName = "NH6 Pursuit/Road Theme Profile")]
    public class RoadThemeProfile : ScriptableObject
    {
        public Color skyTint = new(0.04f, 0.07f, 0.12f);
        public Color roadTint = new(0.07f, 0.09f, 0.11f);
        public Color saffronAccent = new(1f, 0.56f, 0.16f);
        public Color cyanAccent = new(0.27f, 0.84f, 1f);
        public string[] signboardLabels = { "NH48 JAIPUR", "MUMBAI E-WAY", "RING ROAD HEAT" };
    }
}

