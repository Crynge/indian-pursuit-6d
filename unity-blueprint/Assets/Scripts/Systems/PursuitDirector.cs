using NH6Pursuit.Core;
using UnityEngine;

namespace NH6Pursuit.Systems
{
    public class PursuitDirector : MonoBehaviour
    {
        [SerializeField] private Transform interceptor;
        private RaceSessionState raceState;
        private Transform playerTransform;
        private float captureMeter;

        public void Initialize(RaceSessionState state, Transform player)
        {
            raceState = state;
            playerTransform = player;
            captureMeter = 0f;
        }

        private void Update()
        {
            if (raceState == null || raceState.IsBusted || playerTransform == null) return;

            float speedRatio = raceState.SpeedKph / 238f;
            float targetGap = 6.8f - raceState.PolicePressure * 4.3f - speedRatio * 1.2f;
            float targetX = playerTransform.position.x * 0.92f;

            interceptor.position = Vector3.Lerp(
                interceptor.position,
                new Vector3(targetX, interceptor.position.y, targetGap),
                Time.deltaTime * 2.2f
            );

            float pressureRise = (raceState.Heat * 0.78f + (1f - speedRatio) * 0.24f) * Time.deltaTime * 0.58f;
            raceState.PolicePressure = Mathf.Clamp(raceState.PolicePressure + pressureRise - (raceState.IsBoosting ? Time.deltaTime * 0.06f : 0f), 0.08f, 1f);

            bool closeEnough = Vector3.Distance(interceptor.position, playerTransform.position + Vector3.forward * 8f) < 2f;
            captureMeter = Mathf.Clamp01(captureMeter + (closeEnough ? Time.deltaTime * 1.15f : -Time.deltaTime * 0.42f));

            if (captureMeter > 0.9f)
            {
                raceState.IsBusted = true;
            }
        }
    }
}

