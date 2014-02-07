using UnityEngine;
using System.Collections;

[RequireComponent(typeof(SpriteRenderer))]

/**
 * Resize the sprite.
 */
public class ResizeSprite : MonoBehaviour
{
	public enum ResizeSpriteType {
		Stretch,
		Fill,
		Contain
	};

	public float ratio = 1;
	public ResizeSpriteType type = ResizeSpriteType.Fill;

	/**
	 * Do the resizing.
	 */
	void Start ()
	{
		SpriteRenderer renderer = this.GetComponent<SpriteRenderer>();

		float height = 2*Camera.main.orthographicSize;
		float width = height*Camera.main.aspect;
		
		float widthRatio = (width * this.ratio) / renderer.bounds.size.x;
		float heightRatio = (height * this.ratio) / renderer.bounds.size.y;
		float ratio;

		switch (type) {
		case ResizeSpriteType.Stretch:
			this.transform.localScale = new Vector3(this.transform.localScale.x * widthRatio,
			                                        this.transform.localScale.y * heightRatio,
			                                        this.transform.localScale.z);
			break;
		case ResizeSpriteType.Fill:
			ratio = Mathf.Max(widthRatio, heightRatio);
			this.transform.localScale = new Vector3(this.transform.localScale.x * ratio,
			                                        this.transform.localScale.y * ratio,
			                                        this.transform.localScale.z);
			break;
		case ResizeSpriteType.Contain:
			ratio = Mathf.Min(widthRatio, heightRatio);
			this.transform.localScale = new Vector3(this.transform.localScale.x * ratio,
			                                        this.transform.localScale.y * ratio,
			                                        this.transform.localScale.z);
			break;
		}
	}
}
