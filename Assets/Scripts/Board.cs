using UnityEngine;
using System.Collections;

[RequireComponent(typeof(SpriteGrid))]

/**
 * Logic for handling the board - a.k.a. main game logic.
 */
public class Board : MonoBehaviour
{
	SpriteGrid grid;

	/**
	 * The board was clicked.
	 */
	void BoardClicked(Vector2 position)
	{
		Debug.Log("Board was clicked at: " + position.x + "x" + position.y);
		GameObject cell = GameObject.Find("/Cell");
		cell.transform.position = grid.GridToWorldPoint(position);
	}

	/**
	 * Remove event listeners.
	 */
	void OnDisable()
	{
		this.grid.OnClicked -= BoardClicked;
	}

	/**
	 * Add event listeners.
	 */
	void OnEnable()
	{
		this.grid.OnClicked += BoardClicked;
	}

	void Awake()
	{
		this.grid = this.GetComponent<SpriteGrid>();
	}
}
