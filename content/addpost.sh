#!/bin/bash

if [ "$1" == "" ]; then
	echo "Usage: ./addpost.sh /path/to/post";
	exit 254;
fi

CONTENTPATH=$(dirname "`realpath $0`");
LISTRESULT=$(ls "$CONTENTPATH/"*".blogpost");
if [ "$?" != "0" ]; then
	HIGHESTBLOGPOST="$CONTENTPATH/0.blogpost";
else
	HIGHESTBLOGPOST=$(echo "$LISTRESULT" | tac | cut -d $'\n' -f 1 | tac);
fi
HBPNAME="`basename "$HIGHESTBLOGPOST"`";
POSTNUMBER=$(printf "%09d" "`expr "${HBPNAME%.*}" + 1`");
FILENAME="$CONTENTPATH/$POSTNUMBER";
cp "$1" "$FILENAME.blogpost";
head -n 3 "$FILENAME.blogpost" > "$FILENAME.bph"; # Title plus first 2 lines of content will be put in the header
if [ "`wc -c "$FILENAME.bph" | cut -d ' ' -f 1`" -lt "`wc -c "$FILENAME.blogpost" | cut -d ' ' -f 1`" ]; then
	echo "..." >> "$FILENAME.bph";
fi
echo "`expr "${HBPNAME%.*}" + 1`" > "$CONTENTPATH/max.txt";
echo "Done!"