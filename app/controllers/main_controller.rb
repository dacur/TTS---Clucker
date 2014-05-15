class MainController < ApplicationController
	require 'cluckdata.rb'

	def index
		if (session[:user_id])
			redirect_to :action => 'cluck'
		end
  	end

  	def cluck
  		@clucks = CluckData.get_all
  	end
end
