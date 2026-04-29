using NH6Pursuit.Systems;
using UnityEngine;

namespace NH6Pursuit.Core
{
    public class GameBootstrap : MonoBehaviour
    {
        [SerializeField] private RaceSessionState raceState;
        [SerializeField] private PlayerCarController playerCar;
        [SerializeField] private TrafficCoordinator trafficCoordinator;
        [SerializeField] private PursuitDirector pursuitDirector;
        [SerializeField] private RoadStreamSystem roadStreamSystem;

        private void Start()
        {
            raceState.SpeedKph = 110f;
            raceState.Heat = 0.22f;
            raceState.BoostReserve = 1f;
            raceState.Score = 0f;
            raceState.DistanceKm = 0f;
            raceState.PolicePressure = 0.12f;
            raceState.IsBoosting = false;
            raceState.IsBusted = false;

            playerCar.Initialize(raceState);
            trafficCoordinator.Initialize(raceState);
            pursuitDirector.Initialize(raceState, playerCar.transform);
            roadStreamSystem.Initialize(raceState);
        }
    }
}

