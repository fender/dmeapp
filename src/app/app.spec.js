describe('App', function() {
  beforeEach(module('dmeApp'));

  it('should have a NavController defined', inject(function($controller, $rootScope, $location) {
  	scope = $rootScope.$new();

  	ctrl = $controller('NavController', {
  		$scope: scope
  	});

    expect(ctrl).toBeDefined();
  }));

  it('should route to the front page by default', function() {
  	expect(scope.linkIsActive('/')).toBeTruthy();
  });
});