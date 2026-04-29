using NH6Pursuit.Core;
using UnityEngine;

namespace NH6Pursuit.Systems
{
    public class PlayerCarController : MonoBehaviour
    {
        [SerializeField] private float steerLimit = 5.9f;
        [SerializeField] private float steerRate = 6.2f;
        [SerializeField] private float maxSpeed = 238f;
        [SerializeField] private float cruiseDecay = 12f;

        private RaceSessionState raceState;

        public void Initialize(RaceSessionState state)
        {
            raceState = state;
        }

        private void Update()
        {
            if (raceState == null || raceState.IsBusted) return;

            float steer = Input.GetAxisRaw("Horizontal");
            float throttle = Mathf.Clamp01(Input.GetAxisRaw("Vertical"));
            float brake = Input.GetAxisRaw("Vertical") < 0f ? -Input.GetAxisRaw("Vertical") : 0f;
            bool boosting = Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.Space);

            raceState.SpeedKph += throttle * 54f * Time.deltaTime;
            raceState.SpeedKph -= brake * 88f * Time.deltaTime;
            raceState.SpeedKph -= cruiseDecay * Time.deltaTime;

            if (boosting && raceState.BoostReserve > 0.08f)
            {
                raceState.SpeedKph += 45f * Time.deltaTime;
                raceState.BoostReserve = Mathf.Clamp01(raceState.BoostReserve - 0.26f * Time.deltaTime);
                raceState.IsBoosting = true;
            }
            else
            {
                raceState.BoostReserve = Mathf.Clamp01(raceState.BoostReserve + 0.085f * Time.deltaTime);
                raceState.IsBoosting = false;
            }

            raceState.SpeedKph = Mathf.Clamp(raceState.SpeedKph, 64f, maxSpeed);
            raceState.DistanceKm += raceState.SpeedKph * Time.deltaTime * 0.004f;

            Vector3 position = transform.position;
            position.x = Mathf.Clamp(position.x + steer * steerRate * Time.deltaTime, -steerLimit, steerLimit);
            transform.position = position;
        }
    }
}

