using UnityEngine;

namespace NH6Pursuit.Core
{
    [CreateAssetMenu(menuName = "NH6 Pursuit/Race Session State")]
    public class RaceSessionState : ScriptableObject
    {
        public float SpeedKph = 110f;
        public float Heat = 0.22f;
        public float BoostReserve = 1f;
        public float Score;
        public float DistanceKm;
        public float PolicePressure = 0.12f;
        public bool IsBoosting;
        public bool IsBusted;
    }
}

