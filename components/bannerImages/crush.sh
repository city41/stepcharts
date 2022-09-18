for p in *.png
do
    pngcrush $p ${p%.png}c.png && mv ${p%.png}c.png $p
done
