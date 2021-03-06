function onLoad()
{
  // Initialize the map
  var map = new Microsoft.Maps.Map(document.getElementById("myMap"),
        {
           credentials:"Ao0pgKJiEzVEWKCChHTB5JBezW9XvoM4WESpeYywz8wBY9kkWrZWNdKBZmmqz21Y",
           center: new Microsoft.Maps.Location(40, -105.27),
           zoom: 15
        });

  //points are counter-clockwise
  var location1 = new Microsoft.Maps.Location(40,-105.27);
  var location2 = new Microsoft.Maps.Location(40,-105.26);
  var location3 = new Microsoft.Maps.Location(40.01,-105.26);
  var location4 = new Microsoft.Maps.Location(40.01,-105.27);

  // Create a polygon 
  var vertices = [location1, location2, location3, location4];
  var polygoncolor = new Microsoft.Maps.Color(100,100,0,100);
  var polygon = new Microsoft.Maps.Polygon(vertices, {fillColor: polygoncolor, strokeColor: polygoncolor});

  // Add the shape to the map
  map.entities.push(polygon);

  var options = {
     DragHandleImage: 'images/DragHandleWhite.gif',                                      // Image for default drag handle
     DragHandleImageActive: 'images/DragHandleGreen.gif',                                // Image for active drag handle
     DragHandleImageHeight: 10,                                                          // Height for default and active drag handle image
     DragHandleImageWidth: 10,                                                           // Width for default and active drag handle image
     DragHandleImageAnchor: new Microsoft.Maps.Point(5, 5),                              // Anchor Point for drag handle image
     shapeMaskStrokeColor: new Microsoft.Maps.Color(200, 100, 100, 100),                 // Line color of shape mask
     shapeMaskFillColor: new Microsoft.Maps.Color(000, 000, 000, 000),                   // fill color of shape mask (polygon only)
     shapeMaskStrokeThickness: 2,                                                        // line width of shape mask
     shapeMaskStrokeDashArray: '2 2'                                                     // dash pattern of shape mask
  }

  dragHandleLayer = new Microsoft.Maps.EntityCollection()

  var polygonPoints = polygon.getLocations();
  var points = [];

  //make this more prettier

  //South 
  points[0] = new Microsoft.Maps.Location(polygonPoints[0].latitude, (polygonPoints[0].longitude + polygonPoints[1].longitude)/2);
  //East
  points[1] = new Microsoft.Maps.Location((polygonPoints[1].latitude + polygonPoints[2].latitude)/2, polygonPoints[1].longitude)
  //North 
  points[2] = new Microsoft.Maps.Location(polygonPoints[2].latitude, (polygonPoints[2].longitude + polygonPoints[3].longitude)/2);
  //West
  points[3] = new Microsoft.Maps.Location((polygonPoints[0].latitude + polygonPoints[3].latitude)/2, polygonPoints[0].longitude)

  var dragHandles = [];
  var _pointIndex;

  for (i = 0; i < points.length; i++) {
     var dragHandle = new Microsoft.Maps.Pushpin(points[i], { draggable: true, icon: 'images/DragHandleWhite.gif', height: options.DragHandleImageHeight, width: options.DragHandleImageWidth, anchor: options.DragHandleImageAnchor, typeName: 'BM_Module_DragHandle' });
     Microsoft.Maps.Events.addHandler(dragHandle, 'dragstart', StartDragHandler);
     Microsoft.Maps.Events.addHandler(dragHandle, 'drag', DragHandler);
     Microsoft.Maps.Events.addHandler(dragHandle, 'dragend', EndDragHandler);
     Microsoft.Maps.Events.addHandler(dragHandle, 'mouseover', MouseOverDragHandle);
     Microsoft.Maps.Events.addHandler(dragHandle, 'mouseout', MouseOutDragHandle);
     dragHandleLayer.push(dragHandle);
     dragHandles.push(dragHandle);
  }

  map.entities.push(dragHandleLayer);

   //mouseover event handler
  function MouseOverDragHandle(e) {
     //Update handle image
     e.target.setOptions({ icon: options.DragHandleImageActive });
  }

  //mouseout event handler
  function MouseOutDragHandle(e) {
     //Update handle image
     e.target.setOptions({ icon: options.DragHandleImage });
  }

  //drag start event handler
  function StartDragHandler(e) {
     var handleLocation = e.entity.getLocation();

     //Update handle image
     e.entity.setOptions({ icon: options.DragHandleImageActive });

     //Determine point index
     for (i = 0; i <= (points.length - 1); i++) {
        if (handleLocation == points[i]) {
            _pointIndex = i;
            break;
        }
     }
  }

  //drag event handler
  function DragHandler(e) {
     var loc = e.entity.getLocation();
     if (_pointIndex == 0) {
        polygonPoints[0].latitude = loc.latitude;
        polygonPoints[1].latitude = loc.latitude;
        dragHandles[0].setLocation(new Microsoft.Maps.Location(loc.latitude, points[0].longitude));
     }
     if (_pointIndex == 1) {
        polygonPoints[1].longitude = loc.longitude;
        polygonPoints[2].longitude = loc.longitude;
        dragHandles[1].setLocation(new Microsoft.Maps.Location(points[1].latitude, loc.longitude));
     }
     if (_pointIndex == 2) {
        polygonPoints[2].latitude = loc.latitude;
        polygonPoints[3].latitude = loc.latitude;
        dragHandles[2].setLocation(new Microsoft.Maps.Location(loc.latitude, points[2].longitude));

     }
     if (_pointIndex == 3) {
        polygonPoints[0].longitude = loc.longitude;
        polygonPoints[3].longitude = loc.longitude;
        dragHandles[3].setLocation(new Microsoft.Maps.Location(points[3].latitude, loc.longitude));
     }

     polygon.setLocations(polygonPoints);

  }

  //drag end event handler
  function EndDragHandler(e) {
     //Update handle image
     //e.entity.setOptions({ icon: 'images/DragHandle' + (_pointIndex+1) + '.gif' });
     points[0] = new Microsoft.Maps.Location(polygonPoints[0].latitude, (polygonPoints[0].longitude + polygonPoints[1].longitude)/2);
     //East
     points[1] = new Microsoft.Maps.Location((polygonPoints[1].latitude + polygonPoints[2].latitude)/2, polygonPoints[1].longitude)
     //North 
     points[2] = new Microsoft.Maps.Location(polygonPoints[2].latitude, (polygonPoints[2].longitude + polygonPoints[3].longitude)/2);
     //West
     points[3] = new Microsoft.Maps.Location((polygonPoints[0].latitude + polygonPoints[3].latitude)/2, polygonPoints[0].longitude)

     for (var i = 0; i < dragHandles.length; i++) {
        dragHandles[i].setLocation(points[i]);
     }
  }

  Microsoft.Maps.Events.addHandler(polygon, 'mousedown', DraggableStartDragHandler);
  Microsoft.Maps.Events.addHandler(map, 'mousemove', DraggableDragHandler);
  Microsoft.Maps.Events.addHandler(polygon, 'mouseup', DraggableEndDragHandler);
  Microsoft.Maps.Events.addHandler(polygon, 'mouseout', EndDragHandler);

  dragging = false;

  //mousedown handler
  function DraggableStartDragHandler(e) {
      dragging = true;
      previousLoc = map.tryPixelToLocation(new Microsoft.Maps.Point(e.getX(), e.getY()));
  }

  //mousemove handler
  function DraggableDragHandler(e) {
      if (dragging) {
        if(e.targetType == 'polygon') {
          var loc = map.tryPixelToLocation(new Microsoft.Maps.Point(e.getX(), e.getY()));
          var latVariance = 0;
          var longVariance = 0;
          
          //determine variance
          latVariance = loc.latitude - previousLoc.latitude;
          longVariance = loc.longitude - previousLoc.longitude;
          
          previousLoc = loc;
          
          //adjust points in current shape
          var currentPoints = e.target.getLocations();
          for (var i = 0; i < currentPoints.length; i++) {
              currentPoints[i].latitude += latVariance;
              currentPoints[i].longitude += longVariance;
          }
          
          //set new points for polygon
          e.target.setLocations(currentPoints);
          
          e.handled = true;
      }
      else { dragging = false; }
    }
  }

  //mouseup & mouseout handler
  function DraggableEndDragHandler(e) {
      dragging = false;
      var polygonPoints = e.target.getLocations();
      var points = [];
      points[0] = new Microsoft.Maps.Location(polygonPoints[0].latitude, (polygonPoints[0].longitude + polygonPoints[1].longitude)/2);
      //East
      points[1] = new Microsoft.Maps.Location((polygonPoints[1].latitude + polygonPoints[2].latitude)/2, polygonPoints[1].longitude)
      //North 
      points[2] = new Microsoft.Maps.Location(polygonPoints[2].latitude, (polygonPoints[2].longitude + polygonPoints[3].longitude)/2);
      //West
      points[3] = new Microsoft.Maps.Location((polygonPoints[0].latitude + polygonPoints[3].latitude)/2, polygonPoints[0].longitude);
      for (var i = 0; i < dragHandles.length; i++) {
        dragHandles[i].setLocation(points[i]);
      }
  }

  
}