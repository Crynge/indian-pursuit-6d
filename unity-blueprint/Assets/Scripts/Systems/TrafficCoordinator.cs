using NH6Pursuit.Core;
using UnityEngine;

namespace NH6Pursuit.Systems
{
    public class TrafficCoordinator : MonoBehaviour
    {
        [SerializeField] private Transform[] pooledVehicles;
        private RaceSessionState raceState;

        public void Initialize(RaceSessionState state)
        {
            raceState = state;
            ResetTraffic();
        }

        public void ResetTraffic()
        {
            for (int i = 0; i < pooledVehicles.Length; i++)
            {
                pooledVehicles[i].position = new Vector3(-5.4f + (i % 4) * 3.6f, 0f, -30f - i * 14f);
            }
        }

        private void Update()
        {
            if (raceState == null || raceState.IsBusted) return;

            float worldAdvance = (30f + raceState.SpeedKph * 0.37f) * Time.deltaTime;
            for (int i = 0; i < pooledVehicles.Length; i++)
            {
                Transform vehicle = pooledVehicles[i];
                vehicle.position += Vector3.forward * worldAdvance;

                if (vehicle.position.z > 24f)
                {
                    vehicle.position = new Vector3(-5.4f + Random.Range(0, 4) * 3.6f, 0f, -220f - i * 16f - Random.Range(0f, 48f));
                }
            }
        }
    }
}

