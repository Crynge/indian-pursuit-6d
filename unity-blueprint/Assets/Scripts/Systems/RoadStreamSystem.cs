using NH6Pursuit.Core;
using UnityEngine;

namespace NH6Pursuit.Systems
{
    public class RoadStreamSystem : MonoBehaviour
    {
        [SerializeField] private Transform[] roadSegments;
        [SerializeField] private float segmentLength = 36f;

        private RaceSessionState raceState;

        public void Initialize(RaceSessionState state)
        {
            raceState = state;
        }

        private void Update()
        {
            if (raceState == null || raceState.IsBusted) return;

            float advance = (30f + raceState.SpeedKph * 0.37f) * Time.deltaTime;
            float farthest = float.MaxValue;

            for (int i = 0; i < roadSegments.Length; i++)
            {
                roadSegments[i].position += Vector3.forward * advance;
                farthest = Mathf.Min(farthest, roadSegments[i].position.z);
            }

            for (int i = 0; i < roadSegments.Length; i++)
            {
                if (roadSegments[i].position.z > 30f)
                {
                    roadSegments[i].position = new Vector3(0f, 0f, farthest - segmentLength);
                    farthest = roadSegments[i].position.z;
                }
            }
        }
    }
}

