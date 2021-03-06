package main

import (
	"github.com/faiface/pixel"
	"github.com/faiface/pixel/pixelgl"
	"github.com/faiface/pixel/imdraw"
	"golang.org/x/image/colornames"
	"golang.org/x/image/font/basicfont"
	"github.com/faiface/pixel/text"
	"image/color"
	"math"
	"fmt"
)

const (
	screenWidth = 800
	screenHeight = 800
	radius = 200
)

func typeof(v interface{}) string {
    return fmt.Sprintf("%T", v)
}

func run() {
	cfg := pixelgl.WindowConfig{
		Title:  "Beautiful Trigonometry",
		Bounds: pixel.R(0, 0, screenWidth, screenHeight),
		VSync:  true,
	}
	win, err := pixelgl.NewWindow(cfg)
	if err != nil {
		panic(err)
	}

	// Load graphics
	imd := imdraw.New(nil)

	// Load text
	basicAtlas := text.NewAtlas(basicfont.Face7x13, text.ASCII)
	values := text.New(pixel.V(50, 700), basicAtlas)
	values.Color = pixel.RGB(0, 0, 255)
	show_lines := false
	num_balls := 0

	// Begin mainloop
	i := float64(0)
	for !win.Closed() {
		// Check for user input
		if win.JustPressed(pixelgl.MouseButtonLeft) {
			show_lines = !show_lines
		} else if win.JustPressed(pixelgl.MouseButtonRight) {
			num_balls++
			if num_balls > 5 {
				num_balls = 0
			}
		}

		// Clearing canvas
		win.Clear(colornames.Aliceblue)
		imd.Clear()
		values.Clear()

		// Show text
		fmt.Fprintln(values, fmt.Sprint("Angle = ", math.Round(i*100)/100, "Pi"))
		values.Draw(win, pixel.IM.Scaled(values.Orig, 2))

		// Increment angle
		i+= 0.005

		// Draw
		// Circle outline
		if show_lines {
			imd.Color = colornames.Darkslateblue
			imd.Push(pixel.V(screenWidth/2, screenHeight/2))
			imd.Circle(radius, 7)
		}

		//  Main rotating ball
		imd.Color = colornames.Orange
		imd.Push(pixel.V(screenWidth/2 + radius*math.Cos(i*math.Pi), screenHeight/2 + radius*math.Sin(i*math.Pi)))
		imd.Circle(10, 0)

		// Loop through chords
		diagonals := [5]float64{-2.0, 0.0, 4.0, 2.6667, 8}
		colors := [5]color.RGBA{colornames.Darkcyan, colornames.Darkmagenta, colornames.Cyan, colornames.Blueviolet, colornames.Cornflowerblue}

		for d := 0; d < num_balls; d++ {
			shift := 0.0
			if diagonals[d] != 0 {
					shift = float64(math.Pi/diagonals[d])
			}

			// draw axis line
			if show_lines {
				imd.Color = pixel.RGB(0,0,0)
				startx := math.Cos(shift) * radius
				starty := math.Sin(shift) * radius
				imd.Push(pixel.V(screenWidth/2 + startx, screenWidth/2 + starty), pixel.V(screenWidth/2-startx, screenWidth/2-starty))
				imd.Line(2)
				imd.Push(pixel.V(screenWidth/2+startx, screenWidth/2-starty), pixel.V(screenWidth/2-startx, screenWidth/2+starty))
				imd.Line(2)
			}

			// draw balls
			imd.Color = colors[d % len(colors)]
			// 1st to 3rd quadrant
			xcord := screenWidth/2 + math.Sin(shift) * radius * math.Sin(i*math.Pi + shift)
			ycord := screenHeight/2 + math.Cos(shift) * radius * math.Sin(i*math.Pi + shift)
			imd.Push(pixel.V(xcord, ycord))
			imd.Circle(10,0)

			// 2nd to 4th qudrant (reflected over x axis)
			shift = float64(math.Pi - (math.Pi/diagonals[d]))
			xcord2 := screenWidth/2 + math.Sin(shift) * radius * math.Sin(i*math.Pi + shift)
			ycord2 := screenHeight/2 + math.Cos(shift) * radius * math.Sin(i*math.Pi + shift)
			imd.Push(pixel.V(xcord2, ycord2))
			imd.Circle(10,0)
		}


		// Updating window
		imd.Draw(win)
		win.Update()

		// resetting angle
		if i >= 2 {
			i = 0
		}
	}
}

func main() {
	pixelgl.Run(run)
}
